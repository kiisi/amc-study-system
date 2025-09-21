import { Edit, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { doctorExamQuestions } from "../../data/questions";
import { useState } from "react";

export default function ManageQuestions() {

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedSubject, setSelectedSubject] = useState<string>("all");

    const questionsLoading = true;

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Question Database</CardTitle>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search questions..."
                                value={searchTerm}
                                // onChange={(e) => setSearchTerm(e.target.value)}
                                data-testid="input-search-questions"
                            />
                        </div>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[200px]" data-testid="select-filter-subject">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                <SelectItem key={"Doc"} value="Doc">
                                    Doc
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {questionsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading questions...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Question Preview</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctorExamQuestions?.map((question: any, index: number) => (
                                        <TableRow key={index} data-testid={`question-row-${index}`}>
                                            <TableCell className="font-mono text-sm">
                                                #{index}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-md truncate">
                                                    {question.questionText}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{question.subject}</Badge>
                                            </TableCell>
                                            <TableCell>{question.difficulty}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        data-testid={`button-edit-${index}`}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        // onClick={() => deleteQuestionMutation.mutate(question._id)}
                                                        // disabled={deleteQuestionMutation.isPending}
                                                        data-testid={`button-delete-${index}`}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {doctorExamQuestions?.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No questions found</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}