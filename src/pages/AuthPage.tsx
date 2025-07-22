import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [authError, setAuthError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  
  const { signIn, signUp, signInWithProvider, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    const { error } = await signIn(signInEmail, signInPassword);
    if (error) {
      // Provide specific error messages based on the error
      if (error.message.includes('Invalid login credentials')) {
        setAuthError('Incorrect password. Please try again or reset your password.');
      } else if (error.message.includes('Email not confirmed')) {
        setAuthError('Your account is not yet active. Please check your email for a confirmation link.');
      } else if (error.message.includes('User not found')) {
        setAuthError('No account found with this email address. Please sign up.');
      } else {
        setAuthError('Login failed. Please check your credentials and try again.');
      }
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    setSignUpSuccess('');
    
    // Check if passwords match
    if (signUpPassword !== confirmPassword) {
      setAuthError('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    const { error } = await signUp(signUpEmail, signUpPassword, fullName);
    if (!error) {
      setSignUpSuccess(`Sign-up successful! Please check your email at ${signUpEmail} for a confirmation link to activate your account.`);
      // Clear form
      setSignUpEmail('');
      setSignUpPassword('');
      setConfirmPassword('');
      setFullName('');
    } else {
      setAuthError(error.message || 'Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(resetEmail);
    setLoading(false);
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    await signInWithProvider(provider);
    setLoading(false);
  };

  const handleGuestCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Buzzing Treats</h1>
        <p className="text-muted-foreground">Sign in to your account or create a new one</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                {authError && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {authError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="space-y-3 mt-6">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={handleGuestCheckout}
                >
                  Continue as Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Join Buzzing Treats and start earning Loyalty Leafs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signUpSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-4 rounded-md mb-4">
                  {signUpSuccess}
                </div>
              )}
              <form onSubmit={handleSignUp} className="space-y-4">
                {authError && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {authError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;