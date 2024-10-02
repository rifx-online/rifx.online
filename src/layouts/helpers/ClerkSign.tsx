import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, ClerkProvider } from '@clerk/clerk-react';

const ClerkAuth = () => {
  return (
    <ClerkProvider publishableKey="pk_test_c3VidGxlLWxvbmdob3JuLTkzLmNsZXJrLmFjY291bnRzLmRldiQ"> 
      <SignedOut>
        <SignInButton mode="modal">
          登录
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ClerkProvider>
  );
};

export default ClerkAuth;