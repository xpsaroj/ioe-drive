import type { UploadedNote } from "@/types";
// import ResourceFileList from "./ResourceFileList";

interface Props {
    item: UploadedNote;
}

const UploadedNoteCard = ({ item }: Props) => {
    const { title, description, subject, uploader } = item;

    return (
        <div className="md:border py-3 md:p-6 md:rounded-md">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-foreground-secondary">{description}</p>

            <p className="text-xs text-foreground-tertiary mt-1">
                {subject.code} • {subject.name}
            </p>

            {uploader && (
                <p className="text-xs text-foreground-tertiary">
                    Uploaded by {uploader.fullName}
                </p>
            )}

            {/* if later include files: */}
            {/* <ResourceFileList resourceFiles={item.files || []} /> */}
        </div>
    );
};

export default UploadedNoteCard;