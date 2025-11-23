interface GroupForL {
    id: number,
    title: string,
    description: string,
    currentMembers: number,
    maxMembers: number,
    tags: TagModel[]
}

class GroupForCU {
    title: string = ''
    desc: string = ''
    currMem: number = 1
    maxMem: number = 0
    tags: string = ''
}

interface GroupDetail {
    id: number,
    title: string,
    description: string,
    currentMembers: number,
    maxMembers: number,
    tags: TagModel[],
    imageUrl: string,
    ownerUser: User,
    createdAt: string
}

interface GroupEditDetail {
    title: string,
    description: string,
    maxMembers: number,
    tagIds: number[]
}

// interface User {
//     id: number,
//     username: string,
//     avatarUrl?: string
// }

interface User {
    username: string
}

interface Post {
    id: number,
    title: string,
    user: User,
    dateCreated: string,
    comments: Comment[]
}

interface Comment {
    id: number,
    content: string,
    user: User,
    dateCreated: string,
}

interface TagModel {
    id: number,
    name: string
}

interface TagOption {
    value: string,
    label: string;
}

export type {
    GroupForL,
    GroupDetail,
    User,
    Post,
    Comment,
    TagModel,
    TagOption, 
    GroupEditDetail
}

export {
    GroupForCU
}