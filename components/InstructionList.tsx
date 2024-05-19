import React from 'react';
import { useInstructionContext } from '@/context/InstructionContext';
import InstructionItem from './InstructionItem';

const InstructionList = () => {
  const { instructions } = useInstructionContext();

  // Sort instructions based on votes in descending order
  const sortedInstructions = instructions.sort((a, b) => b.votes - a.votes);


  return (
    <ul className="w-full max-w-4xl px-3 sm:px-0">
      
      {sortedInstructions && sortedInstructions.map((instruction, index) => (
        <InstructionItem key={index} index={index} instruction={instruction} />
      ))}
    </ul>
  );
};

export default InstructionList;
