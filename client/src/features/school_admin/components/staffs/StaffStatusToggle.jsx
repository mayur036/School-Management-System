import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { COMMON } from '@/lib/icons';

import { useUpdateStaffStatusMutation } from '../../staff.api';

const StaffStatusToggle = ({ member, onClose }) => {
  const [updateStatus, { isLoading }] = useUpdateStaffStatusMutation();

  if (!member) return null;

  const willActivate = member.status !== 'active';
  const nextStatus = willActivate ? 'active' : 'inactive';
  const fullName = `${member.first_name} ${member.last_name}`;

  const handleConfirm = async () => {
    try {
      await updateStatus({ id: member.staff_id, status: nextStatus }).unwrap();
      toast.success(
        `${fullName} is now ${willActivate ? 'active' : 'inactive'}`
      );
      onClose();
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update staff status');
    }
  };

  return (
    <AlertDialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {willActivate ? 'Activate' : 'Deactivate'} Staff Member
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{' '}
            <strong>{willActivate ? 'activate' : 'deactivate'}</strong>{' '}
            <strong>{fullName}</strong>?
            {!willActivate &&
              ' This staff member will lose access to the system immediately.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer gap-2"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <COMMON.LOADER className="animate-spin" />}
            {willActivate ? 'Activate' : 'Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StaffStatusToggle;
