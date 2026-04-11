set -eu

echo "Optimizing portfolio image assets..."

sips -Z 1600 src/assets/images/projects/COVERS/AWTF.jpg >/dev/null
sips -s formatOptions 78 src/assets/images/projects/COVERS/AWTF.jpg >/dev/null

sips -Z 1600 src/assets/images/projects/COVERS/JENKINS.jpg >/dev/null
sips -s formatOptions 78 src/assets/images/projects/COVERS/JENKINS.jpg >/dev/null

sips -Z 2200 src/assets/images/projects/AWTF/AWTF.jpg >/dev/null
sips -s formatOptions 80 src/assets/images/projects/AWTF/AWTF.jpg >/dev/null

sips -Z 2400 src/assets/images/projects/AWTF/GATE.jpeg >/dev/null
sips -s formatOptions 80 src/assets/images/projects/AWTF/GATE.jpeg >/dev/null

echo "Done."