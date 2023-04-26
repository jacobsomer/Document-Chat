import { type SetStateAction, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { MdModeEdit } from 'react-icons/md';

const Profile = () => {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const supabaseClient = useSupabaseClient();

  const handleEditClick = () => {
    setIsEditing(true);
    setNewFullName((user?.user_metadata.full_name as string) || '');
  };

  const handleSaveClick = async () => {
    // TODO: Call API to update full name
    setIsEditing(false);
    const { data, error } = await supabaseClient.auth.updateUser({
      data: { full_name: newFullName }
    });
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleFullNameChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewFullName(event.target.value);
  };

  const handleEditEmailClick = () => {
    setIsEditingEmail(true);
    setNewEmail(user?.email as string);
  };

  const handleSaveEmailClick = async () => {
    const { data, error } = await supabaseClient.auth.updateUser({
      email: newEmail
    });
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
    setIsEditingEmail(false);
  };

  const handleCancelEmailClick = () => {
    setIsEditingEmail(false);
  };

  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewEmail(event.target.value);
  };

  return (
    <>
      {user && (
        <>
          <input type="checkbox" id="profile-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <label
                htmlFor="profile-modal"
                className="btn-sm btn-circle btn absolute right-2 top-2"
              >
                ✕
              </label>
              <div className="flex-row items-center">
                <div className="flex-col">
                  Full Name:
                  <div className="flex flex-row">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="input-bordered input mr-2"
                          value={newFullName}
                          onChange={handleFullNameChange}
                        />
                        <button
                          className="btn-primary btn mr-2"
                          onClick={() => void handleSaveClick()}
                        >
                          Save
                        </button>
                        <button
                          className="btn-error btn"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-l mr-5 text-gray-500">
                          {user.user_metadata.full_name || 'N/A'}
                        </div>
                        <MdModeEdit
                          className="h-5 w-5 cursor-pointer"
                          onClick={handleEditClick}
                        />
                      </>
                    )}
                  </div>
                  <br />
                  Email:
                  <div className="flex flex-row">
                    {isEditingEmail ? (
                      <>
                        <input
                          type="text"
                          className="input-bordered input mr-2"
                          value={newEmail}
                          onChange={handleEmailChange}
                        />
                        <button
                          className="btn-primary btn mr-2"
                          onClick={() => void handleSaveEmailClick()}
                        >
                          Save
                        </button>
                        <button
                          className="btn-error btn"
                          onClick={handleCancelEmailClick}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-l mr-5 text-gray-500">
                          {user.email}
                        </div>
                        <MdModeEdit
                          className="h-5 w-5 cursor-pointer"
                          onClick={handleEditEmailClick}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
