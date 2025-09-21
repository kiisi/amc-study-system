import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
    Upload,
    Trash2,
    Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Textarea } from "../../components/ui/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { subjectsService } from "../../.server/subjects";
import { createNewQuestion } from "./action";
import { useFetcher } from "react-router";
import type { Route } from "./+types";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';


export async function loader({ params }: Route.LoaderArgs) {
    const subjects = await subjectsService.getAll()
    return subjects;
}

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    return await createNewQuestion(formData, request)
}

export default function AdminPanel({
    loaderData
}: Route.ComponentProps) {

    const { quill, quillRef } = useQuill();

    const [isLoading, setIsLoading] = useState(false)
    const [questionText, setQuestionText] = useState("")
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [correctAnswer, setCorrectAnswer] = useState<string>("");

    const [options, setOptions] = useState<{ [key: string]: string }>({});

    const fetcher = useFetcher()

    const subjects = loaderData.subjects

    const onSubmit = async (data: any) => {
        data.preventDefault();

        try {
            setIsLoading(true)

            const cloudinaryUrl =
                "https://api.cloudinary.com/v1_1/destinyfelixkiisi/image/upload";

            // Upload all images in parallel
            const uploadPromises = selectedImages.map(async (image) => {
                const imageFormData = new FormData();
                imageFormData.append("file", image);
                imageFormData.append("upload_preset", "amc-study-system");
                imageFormData.append("cloud_name", "destinyfelixkiisi");
                imageFormData.append("folder", "amc-study-system");

                const response = await fetch(cloudinaryUrl, {
                    method: "POST",
                    body: imageFormData,
                });

                const result = await response.json();
                return result.url; // Cloudinary returns "url" or "secure_url"
            });

            const questionImages: string[] = await Promise.all(uploadPromises);

            const _options = JSON.stringify(Object.values(options).map((data) => ({ option: data })))

            fetcher.submit(
                {
                    questionText,
                    questionImages: JSON.stringify(questionImages),
                    explanation: quillRef.current.children[0]?.innerHTML ?? '',
                    subject: selectedSubject,
                    options: _options,
                    correctAnswer,
                },
                { method: "post" },
            );

            setQuestionText('')
            setSelectedImages([]);
            setOptions({})
            quill.setText("");
            setCorrectAnswer("");
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedImages(prev => [...prev, ...files].slice(0, 5));
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const optionChangeHandler = (e: string) => {
        console.log(e)
        setCorrectAnswer(options[e])
    }

    const insertToEditor = (url: string) => {
        if (!quill) return; // exit if quill not ready

        const range = quill.getSelection();
        if (range) {
            quill.insertEmbed(range.index, "image", url);
        }
    };

    // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
    const saveToServer = async (file: File) => {
        const imageFormData = new FormData();

        imageFormData.append('file', file);
        imageFormData.append("upload_preset", "amc-study-system")
        imageFormData.append("cloud_name", "destinyfelixkiisi")
        imageFormData.append("folder", "amc-study-system")

        const imageUploadResponse = await fetch("https://api.cloudinary.com/v1_1/destinyfelixkiisi/image/upload", {
            method: 'POST',
            body: imageFormData
        });

        const imageResult = (await imageUploadResponse.json()) as { url: string };

        const imageUrl = imageResult.url as string

        insertToEditor(imageUrl);
    };

    // Open Dialog to select Image File
    const selectLocalImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            saveToServer(file);
        };
    };

    useEffect(() => {
        if (quill) {
            // Add custom handler for Image Upload
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
        }
    }, [quill]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="ml-4 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-lg mr-3">
                                <Users className="text-primary w-5 h-5" />
                            </div>
                            <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">Question Management System</span>
                        </div>
                    </div>
                </div>
            </header>

            <fetcher.Form className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="space-y-6">
                                {/* Question Text */}
                                <fieldset>
                                    <label className="mb-4 block">
                                        Question Text
                                    </label>
                                    <Input
                                        placeholder="Enter the complete question text..."
                                        data-testid="input-question-text"
                                        name="questionText"
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                    />
                                </fieldset>
                                {/* Image Upload */}
                                <div>
                                    <Label className="text-base font-medium mb-2 block">Question Images (Optional)</Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-2">Drop images here or click to browse</p>
                                        <p className="text-sm text-muted-foreground mb-4">Supports JPG, PNG, GIF (Max 5MB each)</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                            data-testid="input-images"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                        >
                                            Choose Files
                                        </Button>
                                    </div>
                                    {selectedImages.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2">Selected Images:</p>
                                            <div className="space-y-2">
                                                {selectedImages.map((image, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                                        <div className="flex gap-2 items-center">
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                className="w-[50px] h-[50px] object-cover"
                                                                alt={image.name}
                                                            />
                                                            <span className="text-sm">{image.name}</span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <fieldset>
                                    <label className="mb-4 block">
                                        Subject
                                    </label>
                                    <Select onValueChange={setSelectedSubject} defaultValue={selectedSubject}>
                                        <SelectTrigger data-testid="select-subject">
                                            <SelectValue
                                                placeholder="Select Subject"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                subjects && subjects.map((data, index) => {
                                                    return (
                                                        <SelectItem key={index} value={data.id}>
                                                            {data.name}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                </fieldset>
                            </div>
                        </div>

                        {/* Answer Options */}
                        <div className="my-6">
                            <Label className="text-base font-medium mb-4 block">Answer Options *</Label>
                            <div>
                                <RadioGroup onValueChange={(e) => optionChangeHandler(e)} defaultValue={correctAnswer}>
                                    <div className="space-y-4">
                                        {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                                            <div key={letter} className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <RadioGroupItem
                                                        value={letter}
                                                        id={`${letter}`}
                                                    />
                                                    <Label
                                                        htmlFor={`${letter}`}
                                                        className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ml-2"
                                                    >
                                                        {letter}
                                                    </Label>
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder={`Option ${letter}`}
                                                        data-testid={`${letter}`}
                                                        name={`${letter}`}
                                                        className="w-full"
                                                        onChange={(e) =>
                                                            setOptions((prev) => ({ ...prev, [letter]: e.target.value }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Answer */}
                        <div className="my-6">
                            <fieldset>
                                <Label className="text-base font-medium mb-4 block">Answer *</Label>
                            </fieldset>
                            <Textarea
                                rows={4}
                                placeholder="Correct answer..."
                                name="correctAnswer"
                                value={correctAnswer}
                                readOnly={true}
                                onChange={(e) => setCorrectAnswer(e.target.value)}
                            />
                        </div>
                        {/* Explanation */}
                        <div className="my-6">
                            <fieldset>
                                <Label className="text-base font-medium mb-4 block">Explanation *</Label>
                            </fieldset>
                            <div>
                                <div ref={quillRef} />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSelectedImages([]);
                                }}
                                data-testid="button-clear-form"
                            >
                                Clear Images
                            </Button>
                            <Button
                                type="submit"
                                onClick={onSubmit}
                                isLoading={fetcher.state === "submitting" || isLoading}
                                data-testid="button-add-question"
                                className="w-[122px]"
                            >
                                Add Question
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </fetcher.Form >
        </div >
    );
}
