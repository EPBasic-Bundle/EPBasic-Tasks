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
        public user_id: number,
        public name: string,
        public primary_color: string,
        public secondary_color: string,
        public created_at?: string,
        public updated_at?: string,
        public tasks?: Task[],
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

export class Unity {
    constructor(
        public id: number,
        public subject_id: number,
        public number: number,
        public created_at?: string,
        public updated_at?: string,
        public tasks?: Task[],
        public exams?: Exam[],
    ) { }
}

export class Task {
    constructor(
        public id: number,
        public subject_id: number,
        public book_id: number,
        public unity_id: number,
        public title: string,
        public description: string,
        public delivery_date: string,
        public done: boolean,
        public created_at?: string,
        public updated_at?: string,
        public pages?: Page[],
        public book?: Book,
    ) { }
}

export class Page {
    constructor(
        public id: number,
        public task_id: number,
        public number: number,
        public created_at?: string,
        public updated_at?: string,
        public exercises?: Exercise[],
    ) { }
}

export class Exercise {
    constructor(
        public id: number,
        public page_id: number,
        public number: number,
        public done: boolean,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Book {
    constructor(
        public id: number,
        public subject_id: number,
        public name: string,
        public pages_quantity: number,
        public last_seen_page: number,
        public image: string,
        public pdf_name: string,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

export class Exam {
    constructor(
        public id: number,
        public subject_id: number,
        public unity_id: number,
        public mark: number,
        public created_at?: string,
        public updated_at?: string,
    ) { }
}

