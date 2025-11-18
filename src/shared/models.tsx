interface GroupForL {
    title: string,
    description: string,
    currentMembers: number,
    maxMembers: number,
    tags: string
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
    tags: string,
    imageUrl: string,
    createdBy: User,
    createdAt: string
}

interface User {
    id: number,
    username: string,
    avatarUrl?: string
}

interface Post {
    id: number,
    content: string,
    author: User,
    createdAt: string,
    likes: number,
    comments: Comment[]
}

interface Comment {
    id: number,
    content: string,
    author: User,
    createdAt: string,
    likes: number
}

export type {
    GroupForL,
    GroupDetail,
    User,
    Post,
    Comment
}

export {
    GroupForCU
}