import { Link2Icon, MoreVertical, PenBox, Trash2 } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function DocumentOptions({doc, deleteDocument}) {
    return (
        <div>
            
            <DropdownMenu>
                <DropdownMenuTrigger> 
                    <MoreVertical className='h-4 w-4 '/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className={'flex gap-2'}>
                        <Link2Icon className='h-4 w-4'/> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className={'flex gap-2'}>
                        <PenBox className='h-4 w-4'/> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className={'flex gap-2 text-red-500'}
                        onClick={() => deleteDocument(doc?.id)}
                    >
                        <Trash2 className='h-4 w-4 text-red-500'/> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default DocumentOptions