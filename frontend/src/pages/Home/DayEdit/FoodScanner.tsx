import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FoodScanItem, FoodScanResult } from "../../../../../shared/types/foodScan";
import { MeasurementUnit, NewIntakeItem } from "../../../../../shared/types/intake";
import { scanFoodPhoto } from "../../../services/nutrition/foodScanApi";
import { createId } from "../../../services/util/utilService";
import { t } from "../../../i18n";
import { useDayEdit } from "./DayEditContext";
import "./FoodScanner.scss";

export function FoodScanner() {
  const { setIntake, setCurrIntakeItemId } = useDayEdit();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const caloriesPerGram = useRef<number[]>([]);

  function stopCamera() {
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setCameraReady(false);
  }
  function close() {
    generation.current++;
    request.current?.abort();
    stopCamera();
    setImage(""); setResult(null); setContext(""); setError(""); setBusy(false); setOpen(false);
  }
  async function startCamera() {
    const token = ++generation.current;
    request.current?.abort();
    stopCamera(); setImage(""); setResult(null); setError(""); setBusy(false);
    if (!window.isSecureContext) {
      setError(t("Camera access requires HTTPS. Open a secure address or choose a photo."));
      return;
    }
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error();
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      if (generation.current !== token) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      if (video.current) { video.current.srcObject = media; await video.current.play(); }
      if (generation.current === token) setCameraReady(true);
    } catch {
      if (generation.current === token) {
        stopCamera();
        setError(t("Camera unavailable. Check camera permissions for this app or browser, or choose a photo."));
      }
    }
  }
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    void startCamera();
    // Native iPhone photo selection can hide Safari; keep the picker mounted.
    const hide = () => { if (document.hidden) stopCamera(); };
    window.addEventListener("pagehide", close);
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", close);
      generation.current++;
      request.current?.abort();
      stream.current?.getTracks().forEach(track => track.stop());
    };
  }, [open]);

  function encode(source: CanvasImageSource, width: number, height: number) {
    if (!width || !height || width * height > 60000000) throw new Error();
    const scale = Math.min(1, 1280 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error();
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    // Re-encoding removes EXIF/location metadata. Nothing is persisted.
    const data = canvas.toDataURL("image/jpeg", 0.8);
    canvas.width = canvas.height = 0;
    if (data.length > 2600000) throw new Error();
    return data;
  }
  function capture() {
    try {
      const v = video.current!;
      setImage(encode(v, v.videoWidth, v.videoHeight)); stopCamera(); setError("");
    } catch { setError(t("Could not read this photo. Please try a different photo.")); }
  }
  async function choosePhoto(selected?: File) {
    if (!selected) return;
    const token = ++generation.current;
    request.current?.abort(); stopCamera(); setBusy(false); setImage(""); setResult(null);
    if (selected.size > 20000000) { setError(t("Please choose a photo smaller than 20 MB.")); return; }
    const url = URL.createObjectURL(selected);
    try {
      const img = new Image(); img.src = url; await img.decode();
      if (generation.current === token) { setImage(encode(img, img.naturalWidth, img.naturalHeight)); setError(""); }
    } catch { if (generation.current === token) setError(t("Could not read this photo. Please try a different photo.")); }
    finally { URL.revokeObjectURL(url); }
  }
  async function analyze() {
    if (busy || !image) return;
    if (!navigator.onLine) { setError(t("Connect to the internet to analyze your meal.")); return; }
    const token = ++generation.current;
    const controller = new AbortController(); request.current = controller;
    const timer = window.setTimeout(() => controller.abort(), 55000);
    setBusy(true); setError("");
    try {
      const estimate = await scanFoodPhoto(image, context, controller.signal);
      if (generation.current === token) {
        caloriesPerGram.current = estimate.items.map(item => item.calories / item.quantity);
        setResult(estimate); setImage("");
      }
    } catch (err) {
      if (generation.current === token) {
        setImage("");
        setError(controller.signal.aborted ? t("Food analysis timed out. Please try again.") :
          err instanceof Error ? t(err.message) : t("Could not analyze the photo. Please try again."));
      }
    } finally { window.clearTimeout(timer); if (generation.current === token) setBusy(false); }
  }
  function edit(index: number, field: keyof FoodScanItem, value: string) {
    if (field === "calories" && result && result.items[index].quantity > 0)
      caloriesPerGram.current[index] = Number(value) / result.items[index].quantity;
    setResult(prev => prev && ({ ...prev, items: prev.items.map((item, i) => {
      if (i !== index) return item;
      if (field === "quantity") {
        const quantity = Number(value);
        return { ...item, quantity, calories: Math.round(caloriesPerGram.current[index] * quantity) };
      }
      return { ...item, [field]: field === "calories" ? Number(value) : value };
    }) }));
  }
  const valid = result && result.items.length > 0 && result.items.every(i =>
    i.name.trim() && i.name.length <= 150 && Number.isFinite(i.quantity) && i.quantity > 0 && i.quantity <= 10000 &&
    Number.isFinite(i.calories) && i.calories >= 0 && i.calories <= 20000);
  function useItems() {
    if (!valid || !result) return;
    const items: NewIntakeItem[] = result.items.map(item => ({ ...item, id: createId(),
      unit: MeasurementUnit.GRAM, caloriesPer100g: item.calories * 100 / item.quantity }));
    setIntake(prev => ({ ...prev, items: [...prev.items.filter(item => item.name.trim()), ...items] }));
    setCurrIntakeItemId(items[0].id);
    close();
  }

  return <>
    <button type="button" className="btn food-scan-trigger" onClick={() => setOpen(true)}>📷 {t("Scan food")}</button>
    {open && createPortal(<dialog ref={dialog} className="food-scanner" aria-labelledby="food-scan-title" onCancel={e => { e.preventDefault(); close(); }}>
      <header><h2 id="food-scan-title">{t("Scan food")}</h2><button type="button" onClick={close} aria-label={t("Close")}>×</button></header>
      <p>{t("Kceli does not save your photo. It is sent to OpenAI to estimate calories.")}</p>
      {error && <p role="alert">{error}</p>}
      {!result && <>
        {!image && <video ref={element => {
          video.current = element;
          if (element && stream.current && element.srcObject !== stream.current) {
            element.srcObject = stream.current;
            void element.play().catch(() => setError(t("Camera unavailable. Check camera permissions for this app or browser, or choose a photo.")));
          }
        }} autoPlay playsInline muted aria-label={t("Camera preview")} />}
        {image && <img src={image} alt={t("Meal photo preview")} />}
        {!busy && <div className="food-scanner__actions">
          {!image && <button type="button" disabled={!cameraReady} onClick={capture}>{t("Take photo")}</button>}
          <button type="button" onClick={() => file.current?.click()}>{t("Choose photo")}</button>
          {(image || !cameraReady) && <button type="button" onClick={startCamera}>{t("Retake")}</button>}
        </div>}
        <input ref={file} hidden type="file" accept="image/*" onChange={e => { void choosePhoto(e.target.files?.[0]); e.target.value = ""; }} />
        {image && <label>{t("Portion details (optional)")}<textarea maxLength={500} value={context} disabled={busy} onChange={e => setContext(e.target.value)} /></label>}
        {image && <button type="button" disabled={busy} onClick={analyze}>{busy ? t("Analyzing meal…") : t("Analyze")}</button>}
        {busy && <p role="status">{t("Analyzing meal…")}</p>}
      </>}
      {result && <>
        <p>{t("Estimated calories. Review portions and ingredients before saving.")}</p>
        <p>{result.assumptions}</p>
        {result.items.length === 0 && <p>{t("No food identified. Please try another photo.")}</p>}
        {result.items.map((item, index) => <fieldset key={index}>
          <legend>{t("Food")} {index + 1}</legend>
          <label>{t("Food name")}<input value={item.name} maxLength={150} onChange={e => edit(index, "name", e.target.value)} /></label>
          <label>{t("Grams")}<input type="number" min="1" max="10000" value={item.quantity} onChange={e => edit(index, "quantity", e.target.value)} /></label>
          <label>{t("Calories")}<input type="number" min="0" max="20000" value={item.calories} onChange={e => edit(index, "calories", e.target.value)} /></label>
          <button type="button" onClick={() => {
            caloriesPerGram.current.splice(index, 1);
            setResult(prev => prev && ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
          }}>{t("Remove")}</button>
        </fieldset>)}
        <p>{t("Total")}: {Math.round(result.items.reduce((sum, item) => sum + item.calories, 0))} {t("kcal")}</p>
        <div className="food-scanner__actions"><button type="button" onClick={startCamera}>{t("Retake")}</button>
          <button type="button" disabled={!valid} onClick={useItems}>{t("Use these items")}</button></div>
      </>}
    </dialog>, document.body)}
  </>;
}
