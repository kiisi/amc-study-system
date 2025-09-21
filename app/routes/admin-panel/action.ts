import { QuestionModel } from "~/lib/models/question";
import dbConnect from "../../.server/db";
import { SubjectModel } from "../../lib/models/subject";

export async function addSubject(formData: FormData, request: Request) {

    let subject = formData.get("subject") as string;

    if (!subject) {
        return {
            status: "error",
            message: "Enter a valid subject"
        }
    }

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    try {
        const newSubject = await SubjectModel.create({ name: subject });

        console.log(newSubject);

        return {
            status: "success",
            message: "Subject created!"
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

// Create New Question
export async function createNewQuestion(formData: FormData, request: Request) {

    console.log(formData)
    let questionText = formData.get("questionText") as string;
    let questionImages = formData.get("questionImages");
    let correctAnswer = formData.get("correctAnswer") as string;
    let explanation = formData.get("explanation") as string;
    let subject = formData.get("subject") as string;
    let options = formData.get("options");

    let _questionImages, _options;

    if (typeof questionImages === "string") {
        _questionImages = JSON.parse(questionImages);
    }

    if (typeof options === "string") {
        _options = JSON.parse(options);
    }

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    try {
        const newSubject = await QuestionModel.create({ 
            questionText, 
            questionImages: _questionImages,
            options: _options,
            subject,
            explanation,
            correctAnswer,
        });

        console.log(newSubject);

        return {
            status: "success",
            message: "Subject created!"
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
