"use client";

import { useEffect, useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/lib/supabase/hooks";
import { updateProfile } from "@/lib/supabase/hooks";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
    const { toast } = useToast();
    const { profile, loading } = useProfile();
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name ?? "");
            setCurrency(profile.currency ?? "USD");
        }
    }, [profile]);

    const handleProfileSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ name, currency });
            toast({
                title: "Profile Updated",
                description: "Your personal information has been saved.",
            });
        } catch (err: any) {
            toast({
                title: "Failed to save profile",
                description: err.message ?? "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-72 rounded-lg" />
                    <Skeleton className="h-72 rounded-lg" />
                </div>
            </div>
        );
    }

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
                                <AvatarImage src="" alt={name} />
                                <AvatarFallback>{name.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">Your profile picture is generated from your name.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={profile?.email ?? ""} disabled />
                            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                        </div>
                        <Button onClick={handleProfileSave} disabled={saving}>Save Changes</Button>
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
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD - United States Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                    <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Currency selection is applied across the app. Preferences are saved when you click Save on the profile card.
                        </p>
                        <Button onClick={handleProfileSave} disabled={saving}>Save Preferences</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
