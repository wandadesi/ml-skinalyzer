import cv2

def draw_bbox(image, detections):
    for det in detections:
        x1, y1, x2, y2 = map(int, det['bbox'])
        label = det['label']
        confidence = det['confidence']

        # Draw bounding box
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Draw label and confidence
        cv2.putText(image, f'{label} {confidence:.2f}', (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    return image
