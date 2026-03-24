import Banner from "./components/Banner";
import React, { useState } from "react";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { useAuth } from "../../../contexts/AuthContext.jsx";

const ProfileOverview = () => {
  const [showModal, setShowModal] = useState(false);
  const { authFetch } = useAuth();
  const { user } = useAuth();

  const changePassword = async ({ oldPassword, newPassword }) => {
    setShowModal(false);
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND_URL}auth/change-password`,
        {
          method: "POST",
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      alert("Password changed!");
    } catch (error) {
      alert("Password change failed! Try again.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner user={user} />
        </div>

        <div className="col-span-8 lg:!mb-0">
          <form className="mx-auto flex max-w-lg flex-col gap-6 rounded-xl bg-white p-8 shadow-md dark:bg-navy-800">
            <h2 className="mb-4 text-2xl font-bold text-navy-700 dark:text-white">
              Account Details
            </h2>
            <div>
              <label
                className="mb-2 block text-gray-700 dark:text-white"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white"
                value={user.name}
                readOnly
              />
            </div>
            <div>
              <label
                className="mb-2 block text-gray-700 dark:text-white"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white"
                value={user.email}
                readOnly
              />
            </div>
            <div>
              <label
                className="mb-2 block text-gray-700 dark:text-white"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white"
                value="encrypted password"
                readOnly
              />
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              onClick={() => setShowModal(true)}
            >
              Change Password
            </button>
          </form>
          <ChangePasswordModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={changePassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
