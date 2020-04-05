export class Author {
    name: string;
    email: string;
    color?: string;

    static equals(a1: Author, a2: Author): boolean {
        if (a1.name === a2.name && a1.email === a2.email) {
            return true;
        } else {
            return false;
        }
    }
}

