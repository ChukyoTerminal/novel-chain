import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

interface ChapterCardProps {
    content: string;
    author: User;
    createdAt: string;
}

export function ChapterCard({ content, author, createdAt }: ChapterCardProps) {
    return (
        <div>
            <Card className="mb-4 z-20">
                <CardHeader>
                    <CardDescription>
                        {author.display_name} - {new Date(createdAt).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{content}</p>
                </CardContent>
            </Card>
        </div>
    );
}
