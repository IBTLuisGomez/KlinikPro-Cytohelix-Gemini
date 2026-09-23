ALTER TABLE clinical_notes DROP CONSTRAINT clinical_notes_practitioner_id_fkey;
ALTER TABLE clinical_notes ADD CONSTRAINT clinical_notes_practitioner_id_fkey FOREIGN KEY (practitioner_id) REFERENCES practitioners (id) ON DELETE SET NULL;
