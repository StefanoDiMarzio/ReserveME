import { forwardRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
  className?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ className, containerClassName, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <View
        className={cn(
          'h-12 flex-row items-center rounded-xl border border-input bg-card px-4',
          error && 'border-destructive',
          containerClassName
        )}
      >
        {leftIcon}
        <TextInput
          ref={ref}
          className={cn(
            'flex-1 text-base text-foreground',
            leftIcon ? 'ml-2' : '',
            rightIcon ? 'mr-2' : '',
            className
          )}
          placeholderTextColor="#9c948c"
          {...props}
        />
        {rightIcon}
      </View>
    );
  }
);
Input.displayName = 'Input';
