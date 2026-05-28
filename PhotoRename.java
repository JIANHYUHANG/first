import java.io.File;
import java.util.Arrays;
import java.util.List;

public class PhotoRename {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("用法: java PhotoRename <照片文件夹路径>");
            return;
        }

        String folderPath = args[0];
        File folder = new File(folderPath);

        if (!folder.exists() || !folder.isDirectory()) {
            System.out.println("错误: 文件夹不存在或不是有效的目录");
            return;
        }

        List<Integer> skipNumbers = Arrays.asList(12, 23);
        int currentNumber = 2;

        File[] files = folder.listFiles((dir, name) -> {
            String lowerName = name.toLowerCase();
            return lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || 
                   lowerName.endsWith(".png") || lowerName.endsWith(".gif") || 
                   lowerName.endsWith(".bmp") || lowerName.endsWith(".webp");
        });

        if (files == null || files.length == 0) {
            System.out.println("文件夹中没有找到照片文件");
            return;
        }

        Arrays.sort(files);

        for (File file : files) {
            while (skipNumbers.contains(currentNumber)) {
                currentNumber++;
            }

            if (currentNumber > 28) {
                System.out.println("已达到最大序号28，停止重命名");
                break;
            }

            String fileName = file.getName();
            String extension = fileName.substring(fileName.lastIndexOf('.'));
            String newFileName = currentNumber + extension;
            File newFile = new File(folder, newFileName);

            if (file.renameTo(newFile)) {
                System.out.println("重命名成功: " + fileName + " -> " + newFileName);
            } else {
                System.out.println("重命名失败: " + fileName);
            }

            currentNumber++;
        }

        System.out.println("重命名任务完成");
    }
}
