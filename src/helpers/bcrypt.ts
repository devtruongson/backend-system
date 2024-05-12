import bcrypt from 'bcrypt';

export async function endCodePassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, 10);
}

export async function comparePassword(passwordUserSend: string, hash: string): Promise<boolean> {
    return await bcrypt.compareSync(passwordUserSend, hash);
}
