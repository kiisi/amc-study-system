
import dbConnect from "~/lib/db";
import validator from 'validator';
import { UserModel } from "~/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userToken } from "~/cookies.server";

export async function loginAccount(formData: FormData, request: Request) {

    let email = formData.get("email") as string;
    let password = formData.get("password") as string;
    console.log(formData)

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


    //   let project = await fakeDb.updateProject({ title });

    try {
        const conn = await dbConnect();
        console.log(conn)
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

        const cookieHeader = request.headers.get("Cookie");
        const cookie = (await userToken.parse(cookieHeader)) || {};
        cookie.showBanner = false;


        return {
            success: true,
            message: 'Login successful.',
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