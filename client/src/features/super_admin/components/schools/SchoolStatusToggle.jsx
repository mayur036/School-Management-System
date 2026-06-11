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

import { useUpdateSchoolStatusMutation } from '../../schools.api';

const SchoolStatusToggle = ({ school, onClose }) => {
  const [updateStatus, { isLoading }] = useUpdateSchoolStatusMutation();

  if (!school) return null;

  const willActivate = school.status !== 'active';
  const nextStatus = willActivate ? 'active' : 'inactive';

  const handleConfirm = async () => {
    try {
      await updateStatus({ id: school.school_id, status: nextStatus }).unwrap();
      toast.success(
        `${school.name} ${willActivate ? 'activated' : 'deactivated'} successfully`
      );
      onClose();
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update school status');
    }
  };

  return (
    <AlertDialog open={!!school} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {willActivate ? 'Activate' : 'Deactivate'} School
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{' '}
            <strong>{willActivate ? 'activate' : 'deactivate'}</strong>{' '}
            <strong>{school.name}</strong>?
            {!willActivate &&
              ' Staff and admins of this school will lose access until it is reactivated.'}
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

export default SchoolStatusToggle;
