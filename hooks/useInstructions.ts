'use client';

import { useState, useEffect } from 'react';
import { Instruction } from '@/types/instruction';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useUser } from '@/context/UserContext'; // Assuming you have a UserContext to handle user authentication

// Define a type for the real-time payload
interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Instruction | null;
  old: Instruction | null;
}

const useInstructions = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  // const [temporaryInstructions, setTemporaryInstructions] = useState<Instruction[]>([]);
  const { toast } = useToast();
  const supabase = supabaseBrowser();
  const { user } = useUser();

  useEffect(() => {
    fetchInstructions();

    // Subscribe to changes in the instructions table
    //! deactivated for now!!!
    const channel = supabase
    .channel('public:instructions')
    .on<RealtimePostgresChangesPayload<Instruction>>('postgres_changes', 
      { event: '*', schema: 'public', table: 'instructions' },
      (payload) => {
        handleRealtimeEvent(payload);
      })
    .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };

  }, [instructions]);


  const fetchInstructions = async () => {
    const { data, error } = await supabase
      .from('instructions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ description: 'Failed to fetch instructions', variant: 'destructive' });
    } else {
      setInstructions(data || []); // Ensure data is not null
    }
  };

  const addInstruction = async (input: string) => {
    if (!user) {
      toast({ description: 'You must be logged in to add an instruction', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('instructions')
      .insert([{ input, votes: 0, user_id: user.id, creator: user.email }])
      .select();

    if (error) {
      toast({ description: 'Failed to add instruction', variant: 'destructive' });
    } else {
      setInstructions((prevInstructions) => [...prevInstructions, ...(data || [])]);
    }
  };

  const handleRealtimeEvent = (payload: any) => {
    const { eventType, new: newInstruction, old: oldInstruction } = payload;

      setInstructions((prevInstructions) => {
        switch (eventType) {
          case 'INSERT':
            return [newInstruction, ...prevInstructions];
            case 'UPDATE':
              return prevInstructions.map((instruction) =>
                instruction.id === newInstruction.id ? newInstruction : instruction
            );
            case 'DELETE':
              return prevInstructions.filter((instruction) => instruction.id !== oldInstruction.id);
              default:
                return prevInstructions;
          }
        });
  };

  // Toggle voting logic for upvote and downvote
  
  const handleVote = async (instructionId: number, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({ description: 'You must be logged in to vote', variant: 'destructive' });
      return;
    }

    const instruction = instructions.find((inst) => inst.id === instructionId);
    if (!instruction) return;

    const { data: existingVote, error: existingVoteError } = await supabase
      .from('instruction_votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('instruction_id', instruction.id)
      .single();

    if (existingVoteError && existingVoteError.code !== 'PGRST116') {
      // Handle errors that are not "No rows found"
      toast({ description: 'Failed to check existing vote', variant: 'destructive' });
      return;
    }

    let updatedVotes = instruction.votes;

    if (existingVote) {
      // If there's an existing vote, we need to adjust the vote count
      if (existingVote.vote_type === voteType) {
        // User is trying to vote the same way again; ignore it
        // toast({ description: `You have already ${voteType}d this instruction`, variant: 'destructive' });
        return;
      } else {
        // User is switching their vote
        updatedVotes = voteType === 'upvote' ? updatedVotes + 1 : updatedVotes - 1;
        const { error: deleteVoteError } = await supabase
          .from('instruction_votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteVoteError) {
          toast({ description: 'Failed to update your vote', variant: 'destructive' });
          return;
        }
      }
    } else {
      // No existing vote, simply add or subtract one
      updatedVotes = voteType === 'upvote' ? updatedVotes + 1 : updatedVotes - 1;
    }

    const { error: updateError } = await supabase
      .from('instructions')
      .update({ votes: updatedVotes })
      .eq('id', instruction.id);

    if (updateError) {
      toast({ description: `Failed to ${voteType} instruction`, variant: 'destructive' });
      return;
    }

    const { error: voteError } = await supabase
      .from('instruction_votes')
      .insert({ user_id: user.id, instruction_id: instruction.id, vote_type: voteType });

    if (voteError) {
      toast({ description: 'Failed to record your vote', variant: 'destructive' });
      return;
    }

    setInstructions((prevInstructions) =>
      prevInstructions.map((inst) => (inst.id === instructionId ? { ...inst, votes: updatedVotes } : inst))
    );
  };

  const handleUpvote = (instructionId: number) => handleVote(instructionId, 'upvote');
  const handleDownvote = (instructionId: number) => handleVote(instructionId, 'downvote');

  // Delete instruction if the user is the creator
  const deleteInstruction = async (id: number) => {
    if (!user) {
      toast({ description: 'You must be logged in to delete an instruction', variant: 'destructive' });
      return;
    }
  
    const instruction = instructions.find((inst) => inst.id === id);
    if (instruction?.user_id !== user.id) {
      toast({ description: 'You can only delete your own instructions', variant: 'destructive' });
      return;
    }
  
    try {
      // delete related votes first
      const { error: deleteVotesError } = await supabase
        .from('instruction_votes')
        .delete()
        .eq('instruction_id', id);
  
      if (deleteVotesError) {
        console.error('Delete votes error:', deleteVotesError);
        toast({ description: `Failed to delete related votes: ${deleteVotesError.message}`, variant: 'destructive' });
        return;
      }
  
      // then delete the instruction
      const { error: deleteInstructionError } = await supabase
        .from('instructions')
        .delete()
        .eq('id', id);
  
      if (deleteInstructionError) {
        console.error('Delete instruction error:', deleteInstructionError);
        toast({ description: `Failed to delete instruction: ${deleteInstructionError.message}`, variant: 'destructive' });
      } else {
        setInstructions((prevInstructions) => prevInstructions.filter((inst) => inst.id !== id));
        toast({ description: 'Instruction deleted', variant: 'default' });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({ description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast({ description: 'Text Copied!', variant: 'default' }),
      (err) => toast({ description: 'Failed to copy!', variant: 'destructive' })
    );
  };

  return {
    instructions,
    addInstruction,
    handleUpvote,
    handleDownvote,
    deleteInstruction,
    copyToClipboard,
  };
};

export default useInstructions;
