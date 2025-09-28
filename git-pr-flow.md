# GitHub Feature Branch Workflow For Pull Request

## 1. Assumptions
- **master** → production-ready, protected, sacred.
- **main** → legacy or behind, ignoring it for now.
- **feature branches** → one per task/fix.
- Repo hosted on **GitHub**.

---

## 2. Step-by-step Flow

### Step 1: Start a new feature branch
Always branch off latest master:
```bash
git fetch origin
git checkout master
git pull origin master  # update local master
git checkout -b feature/new-user-story
````

### Step 2: Do your work

* Edit code, run tests, commit frequently.

```bash
git add .
git commit -m "added: some new feature"
```

### Step 3: Keep your feature branch up-to-date

Before merging, make sure your feature branch has latest master commits:

```bash
git fetch origin
git checkout feature/new-user-story
git rebase master  # keeps history clean
# or git merge master  # if you prefer merge commits
```

* Resolve conflicts if any.
* Run tests after rebase/merge to ensure nothing broke.

### Step 4: Push feature branch to GitHub

```bash
git push -u origin feature/new-user-story
```

### Step 5: Open a PR on GitHub

1. Go to your repo → “Pull requests” → “New pull request”.
2. GitHub will usually suggest **base: main**, **compare: feature/new-user-story**.

### Step 6: Point PR to master

* Change the **base branch** to `master` (dropdown).
* Compare your feature branch (`feature/new-user-story`) to `master`.
* Add title/description:

  ```
  fix: <some fix>

  - Adds <some new feature>
  - Adds <some other feature>
  - Tested on staging and dev
  ```
* Optional: assign yourself as reviewer (solo PR).

### Step 7: Merge PR

* Click **"Merge pull request"** → choose “Squash and merge” (clean history) or “Merge commit” (keeps branch history).
* Delete feature branch after merge (optional).

### Step 8: Update local master

```bash
git checkout master
git pull origin master
```

* Now your local master matches GitHub.

### Step 9: Optional — update main

* If main exists and is behind:

```bash
git checkout main
git merge master
git push origin main
```

* Keeps main in sync, but PRs should always go to master.

---

## 3️⃣ Stashing Unfinished Work (Optional)

* If you need to switch branches without committing unfinished changes:

```bash
git stash save "WIP: pptx slide layout"
git checkout master
# Do stuff on master
```

* When back to your feature branch:

```bash
git checkout feature/new-user-story
git stash pop
```

* Stash allows you to temporarily store changes without committing.

---

## ✅ Notes / Pro Tips

1. Always branch off master, never main.
2. Rebase or merge master into feature before PR → avoids nasty surprises.
3. PR even if solo → acts as self-review, helps avoid bugs.
4. Protect master branch on GitHub (optional) → prevents accidental direct push.
5. Use clear commit messages → “fix:” or “feat:” etc. keeps history readable.


## More on Stashing

### 1. git stash pop

Applies the stashed changes to your current branch and removes that stash from the stash list.

One step: restore + delete.

If there’s a conflict, Git will stop and mark the conflict in the files. Once resolved, the stash is gone (so if something goes wrong, you can’t “pop” it again).

`git stash pop`

### 2. git stash apply

Applies the stashed changes to your current branch but keeps the stash in the stash list.

Two steps: restore but keep the backup.

Useful if you want to try applying the same stash to multiple branches, or if you want a safety net in case the apply causes conflicts you can’t resolve immediately.

`git stash apply`

✅ Quick rule of thumb:

| Command | Removes stash? | Use case |
|---------|----------------|----------|
| pop     | Yes            | Restore changes once, move on |
| apply   | No             | Test on branch, reuse, or keep backup |

---



