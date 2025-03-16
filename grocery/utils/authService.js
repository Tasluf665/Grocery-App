import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const updateUserProfile = async (name) => {
    try {
        await updateProfile(auth.currentUser, { displayName: name });
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { username: name });
    } catch (error) {
        throw new Error('Error updating profile: ' + error.message);
    }
};

export const changeUserPassword = async (currentPassword, newPassword) => {
    try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    } catch (error) {
        throw new Error('Error changing password: ' + error.message);
    }
};