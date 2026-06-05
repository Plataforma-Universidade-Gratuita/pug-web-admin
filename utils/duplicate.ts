export function appendCopyToText(value: string) {
	return `${value} Copy`;
}

export function appendCopyToEmail(
	email: string,
	existingEmails: string[] = [],
) {
	const separatorIndex = email.indexOf("@");
	const localPart =
		separatorIndex === -1 ? email : email.slice(0, separatorIndex);
	const domainPart = separatorIndex === -1 ? "" : email.slice(separatorIndex);
	const match = localPart.match(/^(.*?)(Copy(?:\d+)?)$/);
	const normalizedExistingEmails = new Set(
		existingEmails.map(currentEmail => currentEmail.trim().toLowerCase()),
	);

	if (!match) {
		const candidate = `${localPart}Copy${domainPart}`;
		if (!normalizedExistingEmails.has(candidate.toLowerCase())) {
			return candidate;
		}

		let nextNumber = 2;
		while (true) {
			const numberedCandidate = `${localPart}Copy${nextNumber}${domainPart}`;
			if (!normalizedExistingEmails.has(numberedCandidate.toLowerCase())) {
				return numberedCandidate;
			}
			nextNumber += 1;
		}
	}

	const baseLocalPart = match[1] ?? localPart;
	const currentSuffix = localPart.slice(baseLocalPart.length);
	let nextNumber =
		currentSuffix === "Copy"
			? 2
			: (Number(currentSuffix.slice("Copy".length)) || 1) + 1;

	while (true) {
		const candidate = `${baseLocalPart}Copy${nextNumber}${domainPart}`;
		if (!normalizedExistingEmails.has(candidate.toLowerCase())) {
			return candidate;
		}
		nextNumber += 1;
	}
}
