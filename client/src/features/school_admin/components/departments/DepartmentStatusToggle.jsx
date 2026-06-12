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
import { BASE } from '@/lib/icons';

import { useUpdateDepartmentStatusMutation } from '../../departments.api';

const DepartmentStatusToggle = ({ department, onClose }) => {
  const [updateStatus, { isLoading }] = useUpdateDepartmentStatusMutation();

  if (!department) return null;

  const willActivate = department.status !== 'active';
  const nextStatus = willActivate ? 'active' : 'inactive';
  const deptName = department.name;

  const handleConfirm = async () => {
    try {
      await updateStatus({
        id: department.department_id,
        status: nextStatus,
      }).unwrap();
      toast.success(
        `Department "${deptName}" is now ${willActivate ? 'active' : 'inactive'}`
      );
      onClose();
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update department status');
    }
  };

  return (
    <AlertDialog
      open={!!department}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {willActivate ? 'Activate' : 'Deactivate'} Department
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{' '}
            <strong>{willActivate ? 'activate' : 'deactivate'}</strong> the{' '}
            <strong>{deptName}</strong> department?
            {!willActivate &&
              ' Deactivating this department will set its status to inactive, but staff association will remain.'}
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
            {isLoading && <BASE.LOADER className="animate-spin" />}
            {willActivate ? 'Activate' : 'Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DepartmentStatusToggle;
