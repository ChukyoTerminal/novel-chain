/* eslint-disable max-len */
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { LuHeart } from 'react-icons/lu';

interface ChapterCardProperties {
  content: string;
  author: User;
  createdAt: string;
}

export function ChapterCard({ content, author, createdAt }: ChapterCardProperties) {
  return (
    <div>
      <Card className="mb-4 z-20 rounded-none bg-amber-50 gap-2">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <div className="text-md">
              {author.display_name} - {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex gap-2 m-0">
              <button className="px-3 py-1 rounded bg-transparent border-none hover:bg-amber-100 text-amber-700 flex items-center" onClick={() => {}}>
                <LuHeart className="mr-1" />
              </button>
              <button className="px-3 py-1 rounded bg-transparent border hover:bg-red-100 text-red-700 shadow flex items-center" onClick={() => {}}>
                通報
              </button>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
