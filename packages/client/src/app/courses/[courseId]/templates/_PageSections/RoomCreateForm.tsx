'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Form, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

interface RoomFormValues {
  roomName: string;
  description: string;
  selectedModel: string;
  selectedMethod: string;
}

interface RoomCreateFormProps {
  onCreateRoom: (roomData: RoomFormValues) => void;
}

const RoomCreateForm: React.FC<RoomCreateFormProps> = ({ onCreateRoom }) => {
  const formMethods = useForm<RoomFormValues>({
    defaultValues: {
      roomName: '',
      description: '',
      selectedModel: 'chatgpt',
      selectedMethod: 'direct',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
  } = formMethods;

  const roomName = watch('roomName');
  const description = watch('description');
  const model = watch('selectedModel');
  const method = watch('selectedMethod');

  const onSubmit = (data: RoomFormValues) => {
    if (data.roomName.trim() && data.description.trim()) {
      onCreateRoom(data);
      reset();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)} className='border rounded-md p-4'>
        {/* Room Name */}
        <FormItem>
          <FormLabel htmlFor='roomName'>Room Name</FormLabel>
          <Input
            id='roomName'
            type='text'
            value={roomName}
            onChange={(e) => setValue('roomName', e.target.value)}
            placeholder='Enter room name'
          />
        </FormItem>

        {/* Description */}
        <FormItem>
          <FormLabel htmlFor='description'>Description</FormLabel>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setValue('description', e.target.value)}
            placeholder='Enter room description'
            className='w-full p-2 border border-gray-300 rounded-md text-sm'
            rows={4}
          />
        </FormItem>

        {/* Model Dropdown */}
        <FormItem>
          <FormLabel htmlFor='selectedModel'>Model</FormLabel>
          <select
            id='selectedModel'
            {...register('selectedModel')}
            className='w-full p-2 border border-gray-300 rounded-md text-sm bg-white'
          >
            <option value='chatgpt'>ChatGPT</option>
            <option value='gemini'>Gemini</option>
            <option value='llama3'>Llama 3.1</option>
          </select>
        </FormItem>

        {/* Method Dropdown */}
        <FormItem>
          <FormLabel htmlFor='selectedMethod'>Method</FormLabel>
          <select
            id='selectedMethod'
            {...register('selectedMethod')}
            onChange={(e) => {
              const value = e.target.value;
              setValue('selectedMethod', value);
              if (value !== 'direct') {
                setValue('selectedModel', 'chatgpt');
              }
            }}
            className='w-full p-2 border border-gray-300 rounded-md text-sm bg-white'
          >
            <option value='direct'>Direct</option>
            <option value='multi-agent'>Multi-Agent</option>
            <option value='rag'>RAG</option>
            <option value='combined'>Combined</option>
          </select>
        </FormItem>

        {/* Submit Button */}
        <button
          type='submit'
          className='mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Create Room
        </button>
      </Form>
    </FormProvider>
  );
};

export default RoomCreateForm;