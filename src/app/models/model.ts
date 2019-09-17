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
