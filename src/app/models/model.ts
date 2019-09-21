export class User {
    constructor(
        public id: number,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
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
        public hours?: TimetableHour[],
        public subjects?: TimetableSubject[][],
    ) { }
}

export class TimetableHour {
    constructor(
        public id: number,
        public hour_start: string,
        public hour_end: string,
        public created_at?: string,
        public updated_at?: string,
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

