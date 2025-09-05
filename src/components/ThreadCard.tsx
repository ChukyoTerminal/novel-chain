/* eslint-disable max-len */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { LuHeart } from 'react-icons/lu';
import { Badge } from './ui/badge';
import { Thread } from '@/types';

const ThreadCardColorProperties = {
  'blue': {
    front_cover: 'bg-blue-400',
    back_cover: 'bg-blue-500',
    aspect_cover: 'bg-blue-600'
  },
  'amber': {
    front_cover: 'bg-amber-300',
    back_cover: 'bg-amber-400',
    aspect_cover: 'bg-amber-500'
  },
  'red': {
    front_cover: 'bg-red-400',
    back_cover: 'bg-red-500',
    aspect_cover: 'bg-red-600'
  },
}

interface ThreadCardProperties {
  thread: Thread;
  color: keyof typeof ThreadCardColorProperties;
}

// ThreadCardコンポーネント
export function ThreadCard({ thread, color }: ThreadCardProperties) {
  return (
    <div className="flex w-fit h-fit">
      <Card key={thread.id} className="relative w-55 h-70 p-0 overflow-hidden z-10 rounded-r-xl rounded-l-none shadow-md shadow-gray-400">
        <Button variant="ghost" size="lg" className="w-full h-full p-0">
          <Link href={`/read/${thread.id}`} className={`w-full h-full flex flex-col p-2 ${ThreadCardColorProperties[color].front_cover}`}>
            <CardHeader className="w-full pb-2 px-0">
              <CardTitle className="text-left flex content-between px-1">
                <p className="text-xl flex overflow-hidden">{thread.title}</p>
                <div className="flex items-center gap-1 ml-auto text-sm text-black">
                  <LuHeart />
                  <span>{thread.rating}</span>
                </div>
              </CardTitle>
              <CardDescription className="flex flex-wrap gap-1">
                {thread.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <p className="line-clamp-6 text-left text-sm text-black break-words whitespace-normal overflow-hidden">{thread.summary}</p>
            </CardContent>
          </Link>
        </Button>
      </Card>
      <div className={`relative z-0 h-5 w-55 top-68 right-57 ${ThreadCardColorProperties[color].back_cover} rounded-r-xl shadow-xl shadow-gray-800`} />
      <div className={`relative ${ThreadCardColorProperties[color].aspect_cover} h-71 w-5 top-1 right-113 rounded-sm -skew-y-[25deg] z-20 shadow-md`} />
      <div className={'relative bg-[#e6e0c3] h-2 w-54 z-20 top-70 right-117 -skew-x-[30deg] rounded-l-xl'} />
    </div>
  );
}
