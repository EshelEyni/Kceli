import { ExistingIntakeItemData } from "../../../../shared/types/intake";
import { IIntakeItem } from "../../types/iTypes";
declare function getAllIntakeItems(): Promise<any[]>;
declare function getExistingIntakeItem(newIntakeItem: IIntakeItem): Promise<ExistingIntakeItemData>;
declare const _default: {
    getAllIntakeItems: typeof getAllIntakeItems;
    getExistingIntakeItem: typeof getExistingIntakeItem;
};
export default _default;
