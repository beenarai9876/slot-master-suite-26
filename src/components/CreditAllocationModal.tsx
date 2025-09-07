import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
interface CreditAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onAllocate: (studentId: string, amount: number, notes: string) => void;
}
const CreditAllocationModal: React.FC<CreditAllocationModalProps> = ({
  isOpen,
  onClose,
  student,
  onAllocate
}) => {
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };
  const handleAllocate = async () => {
    if (creditAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    if (creditAmount > 10000) {
      toast({
        title: "Amount Too Large",
        description: "Maximum credit allocation is $10,000 per transaction",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAllocate(student.id, creditAmount, notes);
    toast({
      title: "Credits Allocated Successfully",
      description: `$${creditAmount.toLocaleString()} credits allocated to ${student?.name}`
    });
    setIsProcessing(false);
    onClose();
    setCreditAmount(0);
    setNotes('');
  };
  const handleClose = () => {
    onClose();
    setCreditAmount(0);
    setNotes('');
  };
  const suggestedAmounts = [100, 250, 500, 1000];
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Allocate Credits
          </DialogTitle>
        </DialogHeader>

        {student && <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                    </div>
                    <p className="text-lg font-bold">${student.creditUsed}</p>
                    <p className="text-xs text-muted-foreground">Credits</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground mr-1" />
                    </div>
                    <p className="text-lg font-bold">{student.totalBookings}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mr-1" />
                    </div>
                    <p className="text-lg font-bold">{student.activeBookings}</p>
                    <p className="text-xs text-muted-foreground">Active Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="creditAmount">Credit Amount ($)</Label>
              <Input id="creditAmount" type="number" min="1" max="10000" step="1" value={creditAmount || ''} onChange={e => setCreditAmount(parseInt(e.target.value) || 0)} placeholder="Enter credit amount" className="text-lg" />
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                <span className="text-sm text-muted-foreground self-center">Quick amounts:</span>
                {suggestedAmounts.map(amount => <Button key={amount} variant="outline" size="sm" onClick={() => setCreditAmount(amount)} className="text-xs">
                    ${amount}
                  </Button>)}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this credit allocation..." rows={3} />
            </div>

            {/* Summary */}
            {creditAmount > 0 && <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Credits to Allocate:</span>
                  <span className="text-lg font-bold text-primary">
                    ${creditAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be added to the student's available credit balance
                </p>
              </div>}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleAllocate} disabled={creditAmount <= 0 || isProcessing} className="bg-gradient-primary hover:opacity-90">
                {isProcessing ? <>Processing...</> : <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Allocate ${creditAmount.toLocaleString()}
                  </>}
              </Button>
            </div>
          </div>}
      </DialogContent>
    </Dialog>;
};
export default CreditAllocationModal;