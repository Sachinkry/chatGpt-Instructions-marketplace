// Declare the Instruction interface
export interface Instruction {
  id: number;
  input: string;
  votes: number;
  created_at: string;
  user_id: string;
  creator: string;
}

export interface InstructionVote {
  id: number;
  user_id: string;
  instruction_id: number;
  vote_type: 'upvote' | 'downvote';
}