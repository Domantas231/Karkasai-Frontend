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

export type {
    GroupForL
}

export {
    GroupForCU
}