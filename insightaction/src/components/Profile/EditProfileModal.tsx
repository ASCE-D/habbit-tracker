import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProfile, userDetails } from "@/actions/habit";
import { User } from "@prisma/client";
import Image from "next/image";
import Loader from "../Common/Loader";
import toast from "react-hot-toast";
import PreLoader from "../Common/PreLoader";

const EditProfileModal = ({ onClose }: any) => {
  const [profileData, setProfileData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);

      const result = await userDetails();
      if ("success" in result && result.success) {
        setProfileData(result?.user);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch completed habits:", result);
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Implement your update logic here
    console.log("Submitting profile data:", profileData);
    const result = await updateProfile(profileData);
    if ("success" in result && result.success) {
      toast("Updated profile");
      setIsLoading(false);
    } else {
      console.error("Failed to Update profile:", result);
      toast("Something went wrong");
      setIsLoading(false);
    }
  };

  if (isLoading) return <PreLoader />;
  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[998] bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <Card className={cn("w-[600px]")}>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={profileData?.name ? profileData.name : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={profileData?.email ? profileData.email : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Image
                  src={
                    profileData?.image ? profileData.image : "/team/team-01.png"
                  }
                  alt={profileData?.name ? profileData.name : ""}
                  width={64}
                  height={64}
                  className="rounded-full"
                ></Image>
                {/* <Input
                  id="image"
                  name="image"
                  placeholder="URL to your profile image"
                  value={profileData?.image ? profileData.image : ""}
                  // onChange={handleInputChange}
                /> */}
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password (optional)"
                  value={profileData.password}
                  onChange={handleInputChange}
                />
              </div> */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                <SaveIcon className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>,
    document.body,
  );
};

export default EditProfileModal;
