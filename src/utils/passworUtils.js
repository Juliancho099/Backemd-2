import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

export { hashPassword, comparePassword };