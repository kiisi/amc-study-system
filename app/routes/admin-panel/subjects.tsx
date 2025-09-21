import { useFetcher } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { addSubject } from "./action";
import { subjectsService } from "../../.server/subjects";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useEffect, useRef } from "react";

export async function loader({ params }: Route.LoaderArgs) {
    const subjects = await subjectsService.getAll()
    return subjects;
}

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    return await addSubject(formData, request)
}

export default function Subjects({
    loaderData,
}: Route.ComponentProps) {

    const subjects = loaderData.subjects


    let subjectFetcher = useFetcher()

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (subjectFetcher.state === "idle") {
            formRef.current?.reset();
        }
    }, [subjectFetcher.state]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject Management</CardTitle>
            </CardHeader>
            <CardContent>
                <subjectFetcher.Form
                    method="post"
                    ref={formRef}
                    className="mb-6 flex gap-2"
                >
                    <Input
                        placeholder="New Subject"
                        name="subject"
                    />
                    <Button
                        isLoading={subjectFetcher.state === "submitting"}
                        type="submit"
                        className="px-6 h-[40px]"
                    >
                        Add
                    </Button>
                </subjectFetcher.Form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((data) => {
                        return (
                            <Card key={data.id} className="p-4">
                                <h3 className="font-semibold text-foreground mb-2">{data.name}</h3>
                            </Card>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}