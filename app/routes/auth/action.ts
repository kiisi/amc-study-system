
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redirect } from "react-router";
import dbConnect from '../../.server/db';
import { UserModel } from '../../lib/models/user';
import { commitSession, getSession } from '../../.server/sessions';

// Login
export async function loginAccount(formData: FormData, request: Request) {

    let email = formData.get("email") as string;
    let password = formData.get("password") as string;

    if (!validator.isEmail(email)) {
        return {
            status: "error",
            message: "Not a valid email"
        }
    }

    if (!password) {
        return {
            status: "error",
            message: "Not a valid password"
        }
    }

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log("==>", error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    try {
        const isExistingUser = await UserModel.findOne({ email })

        if (!isExistingUser) {
            return {
                status: "error",
                message: 'This account does not exists.',
            }
        }

        const isPasswordValid = await bcrypt.compare(password, isExistingUser.password!);

        if (!isPasswordValid) {
            return {
                status: "error",
                message: 'Invalid credentials',
            }
        }

        const token = jwt.sign({ _id: isExistingUser._id }, process.env.SECRET_KEY!, { expiresIn: "7d" });

        const session = await getSession(
            request.headers.get("Cookie"),
        );

        session.set("token", token);

        return redirect("/dashboard", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An unknown error occured',
        }
    }
}

// Register

export async function registerAccount(formData: FormData, request: Request) {

    let firstName = formData.get("firstName") as string;
    let lastName = formData.get("lastName") as string;
    let email = formData.get("email") as string;
    let password = formData.get("password") as string;

    if (!firstName) {
        return {
            status: "error",
            message: "First name is blank"
        }
    }

    if (!lastName) {
        return {
            status: "error",
            message: "Last name is blank"
        }
    }

    if (!validator.isEmail(email)) {
        return {
            status: "error",
            message: "Not a valid email"
        }
    }

    if (!password) {
        return {
            status: "error",
            message: "Not a valid password"
        }
    }

    if (password?.length < 4) {
        return {
            status: "error",
            message: "Password length must be a minimum of 4 characters"
        }
    }

    try {
        await dbConnect();
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    try {

        const isExistingUser = await UserModel.findOne({ email })

        if (isExistingUser) {
            return {
                status: "error",
                message: 'An account with this email already exists.',
            }
        }

        const hashedPassword = await bcrypt.hash(password!, 12);

        await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        return {
            status: "success",
            message: 'Account created successfully.',
        }
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An unknown error occured',
        }
    }
}