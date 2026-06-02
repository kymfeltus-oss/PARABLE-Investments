"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import {
  CONTINUE_WITHOUT_LOGIN_PROFILE,
  PRESENTER_STUDIO_ROUTE,
  savePresenterDemoProfile,
} from "@/lib/presenter-demo-profile";
import { cn } from "@/lib/utils";
import styles from "./presenter-access.module.css";

type Tab = "login" | "create";

export function PresenterAccessPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createCompany, setCreateCompany] = useState("");

  function goToStudio() {
    router.push(PRESENTER_STUDIO_ROUTE);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const email = loginEmail.trim() || "demo@pitchlock.local";
    savePresenterDemoProfile({
      fullName: email.split("@")[0] || "Presenter",
      email,
      companyName: "Untitled Pitch",
    });
    goToStudio();
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    savePresenterDemoProfile({
      fullName: createName.trim() || "Presenter",
      email: createEmail.trim() || "demo@pitchlock.local",
      companyName: createCompany.trim() || "Untitled Pitch",
    });
    goToStudio();
  }

  function handleContinueWithoutLogin() {
    savePresenterDemoProfile(CONTINUE_WITHOUT_LOGIN_PROFILE);
    goToStudio();
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden>
        <div className={styles.glowCyan} />
        <div className={styles.glowPurple} />
      </div>

      <div className={styles.inner}>
        <section className={styles.brandCol} aria-labelledby="presenter-access-headline">
          <Link href="/" className={styles.backLink}>
            ← Back to intro
          </Link>
          <PitchLockLogo size="lg" layout="stacked" />
          <div>
            <h1 id="presenter-access-headline" className={styles.headline}>
              Presenter Access
            </h1>
            <p className={styles.subhead}>
              Create and manage your private investor pitch experience.
            </p>
          </div>
        </section>

        <section className={styles.panelCol} aria-label="Presenter sign in">
          <div className={styles.glassPanel}>
            <div className={styles.tabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "login"}
                className={cn(styles.tab, tab === "login" && styles.tabActive)}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "create"}
                className={cn(styles.tab, tab === "create" && styles.tabActivePurple)}
                onClick={() => setTab("create")}
              >
                Create Account
              </button>
            </div>

            {tab === "login" ? (
              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.field}>
                  <label className="pl-input-label" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="pl-input w-full"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className="pl-input-label" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-input w-full"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className={styles.actions}>
                  <button type="submit" className="pl-btn pl-btn-primary w-full">
                    Login
                  </button>
                </div>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleCreate}>
                <div className={styles.field}>
                  <label className="pl-input-label" htmlFor="create-name">
                    Full name
                  </label>
                  <input
                    id="create-name"
                    type="text"
                    autoComplete="name"
                    className="pl-input w-full"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className="pl-input-label" htmlFor="create-email">
                    Email
                  </label>
                  <input
                    id="create-email"
                    type="email"
                    autoComplete="email"
                    className="pl-input w-full"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className="pl-input-label" htmlFor="create-password">
                    Password
                  </label>
                  <input
                    id="create-password"
                    type="password"
                    autoComplete="new-password"
                    className="pl-input w-full"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className="pl-input-label" htmlFor="create-company">
                    Company / business name
                  </label>
                  <input
                    id="create-company"
                    type="text"
                    autoComplete="organization"
                    className="pl-input w-full"
                    value={createCompany}
                    onChange={(e) => setCreateCompany(e.target.value)}
                  />
                </div>
                <div className={styles.actions}>
                  <button type="submit" className="pl-btn pl-btn-primary w-full">
                    Create account
                  </button>
                </div>
              </form>
            )}

            <div className={styles.divider}>or</div>

            <button
              type="button"
              className={cn("pl-btn pl-btn-outline", styles.continueBtn)}
              onClick={handleContinueWithoutLogin}
            >
              Continue without login
            </button>

            <p className={styles.demoNote}>
              Demo mode. Authentication will be connected later. Your studio is not blocked.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
