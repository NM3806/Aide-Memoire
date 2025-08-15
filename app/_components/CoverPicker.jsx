import React, { useState } from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import CoverOption from '../_shared/CoverOption'

function CoverPicker({ children, setNewCover }) {
    const [selectedCover, setSelectedCover] = useState();
    return (
        <Dialog>
            <DialogTrigger className='w-full'>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update cover</DialogTitle>
                    <DialogDescription>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3'>
                            {CoverOption.map((cover, index) => (
                                <div onClick={() => setSelectedCover(cover?.imageUrl)}
                                    className={`${selectedCover == cover?.imageUrl && 'border-primary border-2 transition-all'} p-1 rounded-lg`}>
                                    <Image className='h-[70px] w-full rounded-md object-cover'
                                        src={cover?.imageUrl} width={200} height={140} alt='coverOptions' />
                                </div>
                            ))}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary"
                            className="cursor-pointer">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={() => setNewCover(selectedCover)}
                        className="cursor-pointer">
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CoverPicker