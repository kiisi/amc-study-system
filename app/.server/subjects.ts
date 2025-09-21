import { SubjectModel } from "../lib/models/subject";
import dbConnect from "./db"

export const subjectsService = {
    getAll: async () => {
        try {
            await dbConnect();

            const subjects = await SubjectModel.find().lean();

            const cleanSubjects = subjects.map((subj) => ({
                id: subj._id.toString(),
                name: subj.name
            }));

            return {
                status: "success",
                subjects: cleanSubjects,
            }
        }
        catch (error) {
            return {
                status: "error",
                message: "An error occurred"
            }
        }
    }
}