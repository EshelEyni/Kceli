"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostType = exports.UserRelationKind = void 0;
var UserRelationKind;
(function (UserRelationKind) {
    UserRelationKind["Follow"] = "Follow";
    UserRelationKind["Block"] = "Block";
    UserRelationKind["Mute"] = "Mute";
})(UserRelationKind || (exports.UserRelationKind = UserRelationKind = {}));
var PostType;
(function (PostType) {
    PostType["TEXT"] = "text";
    PostType["POLL"] = "poll";
    PostType["IMAGE"] = "image";
    PostType["VIDEO"] = "video";
    PostType["SONG_REVIEW"] = "song-review";
    PostType["MOVIE_REVIEW"] = "movie-review";
})(PostType || (exports.PostType = PostType = {}));
//# sourceMappingURL=enums.js.map