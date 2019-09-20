export class User {
    constructor(
        public id: number,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password: string,
        public avatar?: string,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Subject {
    constructor(
        public id: number,
        public name: string,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Timetable {
    constructor(
        public id: number,
        public user_id: number,
        public rows: number,
        public created_at?: string,
        public updated_at?: string,
        public hours?,
        public subjects?: TimetableSubject[][],
    ) { }
}

export class TimetableSubject {
    constructor(
        public id: number,
        public subject_id: number,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Topics {
    constructor(
        public id: number,
        public subject_id: number,
        public name: string,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Exams {
    constructor(
        public id: number,
        public subject_id: number,
        public grade: number,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Homeworks {
    constructor(
        public id: number,
        public subject_id: number,
        public grade: number,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

