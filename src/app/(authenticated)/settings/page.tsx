"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userProfile as initialProfile } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { toast } = useToast();
    const [userProfile, setUserProfile] = useState(initialProfile);
    const [avatarPreview, setAvatarPreview] = useState("https://picsum.photos/seed/1/80/80");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({ ...userProfile, name: e.target.value });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({ ...userProfile, email: e.target.value });
    };

    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleProfileSave = () => {
        // In a real app, you'd send this data to your backend
        console.log("Saving profile:", userProfile, "Avatar:", avatarPreview);
        toast({
            title: "Profile Updated",
            description: "Your personal information has been saved.",
        });
    };

    const handlePreferencesSave = () => {
        // In a real app, you'd save these preferences
        console.log("Saving preferences");
        toast({
            title: "Preferences Saved",
            description: "Your app preferences have been updated.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and app preferences.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarPreview} alt={userProfile.name} />
                                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="picture" className="cursor-pointer">
                                   <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                        Upload new picture
                                    </div>
                                </Label>
                                <Input id="picture" type="file" className="hidden" accept="image/*" onChange={handlePictureUpload} />
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={userProfile.name} onChange={handleNameChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={userProfile.email} onChange={handleEmailChange}/>
                        </div>
                        <Button onClick={handleProfileSave}>Save Changes</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your app experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue={userProfile.currency}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD - United States Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                             <Select>
                                <SelectTrigger id="timezone">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gmt-5">GMT-5 (Eastern Time)</SelectItem>
                                    <SelectItem value="gmt-8">GMT-8 (Pacific Time)</SelectItem>
                                    <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handlePreferencesSave}>Save Preferences</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
