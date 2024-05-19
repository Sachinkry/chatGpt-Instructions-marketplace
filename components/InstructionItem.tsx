import React, { useState } from 'react';
import { Instruction } from '@/types/instruction';
import { useInstructionContext } from '@/context/InstructionContext';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { useUser } from '@/context/UserContext';

interface InstructionItemProps {
  index: number;
  instruction: Instruction;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ index, instruction }) => {
  const { handleUpvote, handleDownvote, deleteInstruction, copyToClipboard } = useInstructionContext();
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <li className="px-3 py-3 mb-2 bg-neutral-100 rounded-xs text-black gap-3 flex flex-row">
      {/* upvote */}
      <div className="flex flex-col items-center gap-0.5 text-gray-400 text-xs">
        <span className="cursor-pointer text-sm" onClick={() => handleUpvote(instruction.id)}>
          <BiUpvote />
        </span>
        <span className="text-sm font-bold text-center text-gray-500 ">
          {instruction.votes < 10 ? `0${instruction.votes}` : instruction.votes}
        </span>
        <span className="cursor-pointer text-sm" onClick={() => handleDownvote(instruction.id)}>
          <BiDownvote />
        </span>
      </div>

      <div className="flex flex-col gap-1 flex-grow cursor-pointer" onClick={toggleExpand} >
        {/* here use user_id to get email from User and use the text before @ as value in the bleow p tag */}
        <p className="flex w-full font-semibold text-xs text-gray-400 justify-right underline">@{instruction.creator.split('@')[0]}</p>
        <p className={`text-xs text-gray-600  ${isExpanded ? '' : 'line-clamp-3'}`}>
          {instruction.input}
        </p>
        <span className="text-xs text-purple-600/60 cursor-pointer">
          {isExpanded ? 'Show less' : 'Show more'}
        </span>
      </div>
      {/* clipboard */}
      {isExpanded &&
        <div className=" flex flex-col justify-between gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400 cursor-pointer hover:text-purple-600/70" onClick={() => copyToClipboard(instruction.input)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
          {/* delete button */}
          {user && user.id === instruction.user_id && (
           
            
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-red-600" onClick={() => deleteInstruction(instruction.id)}>
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
          )}
        </div>
      }
    </li>
  );
};

export default InstructionItem;
