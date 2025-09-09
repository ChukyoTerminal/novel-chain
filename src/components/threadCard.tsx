// カラー定義をJSオブジェクトで管理
const colorMap = {
  red:   { front: '#ff9e91', aspect: '#c42127', back: '#bd756c' },
  blue:  { front: '#91caff', aspect: '#2176c4', back: '#6c9fbd' },
  yellow:{ front: '#ffeb91', aspect: '#c4a321', back: '#bdb76c' },
  green: { front: '#91ffb3', aspect: '#21c468', back: '#5db370' },
  purple:{ front: '#d391ff', aspect: '#7c21c4', back: '#9f6cbd' },
  gray:  { front: '#b0b0b0', aspect: '#4f4f4f', back: '#7a7a7a' },
  paper:'#e6e0c3'
};
/* eslint-disable max-len */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { LuHeart } from 'react-icons/lu';
import { Badge } from './ui/badge';
import { Thread } from '@/types';

const ThreadCardColorProperties = {
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  purple: 'purple',
  gray: 'gray'
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
          <Link
            href={`/read/${thread.id}`}
            style={{ '--bg-front': colorMap[color].front, '--bg-front-hover': colorMap[color].back } as React.CSSProperties}
            className="w-full h-full flex flex-col p-2 bg-[var(--bg-front)] hover:bg-[var(--bg-front-hover)]"
          >
            <CardHeader className="w-full pb-2 px-0">
              <CardTitle className="text-left flex content-between px-1">
                <p className="text-xl flex overflow-clip w-40">{thread.title}</p>
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
      <div
        className="relative z-0 h-5 w-55 top-68 right-57 rounded-r-xl shadow-xl shadow-gray-800"
        style={{ backgroundColor: colorMap[color].back }}
      />
      <div
        className="relative h-71 w-5 top-1 right-113 rounded-sm -skew-y-[25deg] z-20 shadow-md"
        style={{ backgroundColor: colorMap[color].aspect }}
      />
      <div className="relative h-2 w-54 z-20 top-70 right-117 -skew-x-[30deg] rounded-l-xl" style={{ backgroundColor: colorMap['paper'] }} />
    </div>
  );
}
