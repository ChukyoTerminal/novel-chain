/* eslint-disable max-len */
interface BookShelfSeparatorProperties {
  width?: string;
}

interface BookShelfLegProperties {
  flip: boolean;
}

const BookShelfLeg: React.FC<BookShelfLegProperties> = ({ flip }) => (
  <div className='h-8 w-fit'>
    <div className={`h-full w-4 ${flip ? '[clip-path:polygon(0_0,100%_0,100%_100%,50%_100%)]' : '[clip-path:polygon(0_0,100%_0,50%_100%,0_100%)] '} bg-stone-400`} />
    <div className={`relative z-10 h-full w-4 -top-8 ${flip ? '[clip-path:polygon(50%_0,100%_0,100%_100%,100%_100%)]' : '[clip-path:polygon(0_0,50%_0,0_100%,0_100%)]'} bg-stone-600`} />
  </div>
);

export function BookShelfSeparator({ width = '220' }: BookShelfSeparatorProperties) {
  return (
    <div className={`relative overflow-visible mx-25 bottom-3 mb-2 w-${width} justify-center`}>
      <div className='h-4 w-full bg-orange-300 shadow' />
      <div className='h-2 w-full bg-neutral-600 border-bg [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]' />
      <div className='relative flex justify-between w-200 -top-2 mx-auto'>
        <BookShelfLeg flip={true} />
        <BookShelfLeg flip={false} />
      </div>
    </div>
  )
}
