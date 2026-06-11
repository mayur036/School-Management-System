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

import { useUpdateSchoolAdminStatusMutation } from '../../schoolAdmins.api';

const AdminStatusToggle = ({ admin, onClose }) => {
  const [updateStatus, { isLoading }] = useUpdateSchoolAdminStatusMutation();

  const handleConfirm = async () => {
    if (!admin) return;

    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    try {
      await updateStatus({ id: admin.staff_id, status: newStatus }).unwrap();
      toast.success(
        `Admin ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      );
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to update status'
      );
    }
  };

  if (!admin) return null;

  const isActivating = admin.status !== 'active';

  return (
    <AlertDialog open={!!admin} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <COMMON.POWER
              className={`size-5 ${isActivating ? 'text-emerald-500' : 'text-amber-500'}`}
            />
            {isActivating ? 'Activate Admin' : 'Deactivate Admin'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isActivating ? 'activate' : 'deactivate'}{' '}
            <span className="text-foreground font-semibold">
              {admin.first_name} {admin.last_name}
            </span>
            ?
            {!isActivating &&
              ' They will immediately lose access to their account and the school dashboard.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            className={`cursor-pointer gap-2 ${
              isActivating
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {isLoading && <COMMON.LOADER className="size-4 animate-spin" />}
            {isLoading
              ? 'Updating...'
              : isActivating
                ? 'Yes, Activate'
                : 'Yes, Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminStatusToggle;
