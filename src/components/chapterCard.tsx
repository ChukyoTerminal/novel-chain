/* eslint-disable max-len */
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { LuHeart } from 'react-icons/lu';

interface ChapterCardProperties {
  content: string;
  author: User;
  createdAt: string;
  showReportButton?: boolean;
  enableLikeButton?: boolean;
}

export function ChapterCard({ content, author, createdAt, showReportButton = true, enableLikeButton = true }: ChapterCardProperties) {
  return (
    <div>
      <Card className="mb-4 z-20 rounded-none bg-amber-50 gap-2 min-w-4xl">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <div className="text-md">
              {author.display_name} - {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex gap-2 m-0">
              <button 
                className={`px-3 py-1 rounded bg-transparent border-none hover:bg-amber-100 text-amber-700 flex items-center ${!enableLikeButton ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={() => {}}
                disabled={!enableLikeButton}
              >
                <LuHeart className="mr-1" />
              </button>
              {showReportButton && (
                <button className="px-3 py-1 rounded bg-transparent border hover:bg-red-100 text-red-700 shadow flex items-center" onClick={() => {}}>
                  通報
                </button>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="break-words overflow-wrap-anywhere">{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
